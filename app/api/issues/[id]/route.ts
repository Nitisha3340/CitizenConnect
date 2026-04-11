import { NextResponse } from "next/server";
import { removeIssue, updateIssueStatus } from "@/app/api/issues/store";

type UpdateBody = {
  status?: "Pending" | "In Progress" | "Resolved";
  assignedPolitician?: string;
};

function getRole(req: Request) {
  return (req.headers.get("x-user-role") || "").toLowerCase();
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (getRole(req) !== "politician") {
      return NextResponse.json({ success: false, message: "Only politicians can update issue status" }, { status: 403 });
    }

    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ success: false, message: "Invalid issue id" }, { status: 400 });
    }

    const body = (await req.json()) as UpdateBody;
    if (!body.status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    const updated = await updateIssueStatus(id, body.status, body.assignedPolitician);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, backend: updated.backend, data: updated.row });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update issue" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    if (getRole(req) !== "moderator") {
      return NextResponse.json({ success: false, message: "Only moderators can delete issues" }, { status: 403 });
    }

    const { id: idParam } = await context.params;
    const id = Number(idParam);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ success: false, message: "Invalid issue id" }, { status: 400 });
    }

    const deleted = await removeIssue(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Issue deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete issue" },
      { status: 500 }
    );
  }
}
