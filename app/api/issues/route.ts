import { NextResponse } from "next/server";
import { createIssue, listIssues } from "@/app/api/issues/store";

type CreateIssueBody = {
  title?: string;
  description?: string;
  status?: "Pending" | "In Progress" | "Resolved";
  severity?: "Low" | "Medium" | "High";
  zone?: string;
  region?: string;
  createdBy?: string;
  createdById?: string;
  email?: string;
  assignedPolitician?: string;
};

export async function GET(req: Request) {
  try {
    const zone = new URL(req.url).searchParams.get("zone") || undefined;
    const result = await listIssues(zone);
    return NextResponse.json({ success: true, backend: result.backend, data: result.rows });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to list issues" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateIssueBody;

    if (!body.title || !body.description || !body.zone || !body.createdBy || !body.createdById || !body.email) {
      return NextResponse.json({ success: false, message: "Missing required issue fields" }, { status: 400 });
    }

    const result = await createIssue({
      title: body.title,
      description: body.description,
      status: body.status || "Pending",
      severity: body.severity || "Low",
      zone: body.zone,
      region: body.region || body.zone,
      createdBy: body.createdBy,
      createdById: body.createdById,
      email: body.email,
      assignedPolitician: body.assignedPolitician || "",
    });

    return NextResponse.json({ success: true, backend: result.backend, data: result.row }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create issue" },
      { status: 500 }
    );
  }
}
