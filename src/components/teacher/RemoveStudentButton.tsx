"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { removeStudentFromClassroomAction } from "@/server/actions/classrooms";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinus } from "lucide-react";

export function RemoveStudentButton({
  classroomId,
  studentId,
  confirmMessage,
}: {
  classroomId: string;
  studentId: string;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      await removeStudentFromClassroomAction({ classroomId, studentId });
      router.refresh();
    });
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleClick}
      disabled={pending}
      className="text-muted-foreground hover:text-danger"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <UserMinus className="size-4" />
      )}
    </Button>
  );
}
