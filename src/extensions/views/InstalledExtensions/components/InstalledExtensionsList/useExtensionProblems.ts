import { AppProblem, isProblemCritical, isProblemDismissed } from "@dashboard/extensions/types";
import { useMemo, useState } from "react";

export const useExtensionProblems = (problems: AppProblem[]) => {
  const activeProblems = useMemo(() => problems.filter(p => !isProblemDismissed(p)), [problems]);

  const totalCount = activeProblems.length;
  const criticalCount = useMemo(
    () => activeProblems.filter(p => isProblemCritical(p)).length,
    [activeProblems],
  );

  const hasActiveProblems = totalCount > 0;
  const hasAnyProblems = problems.length > 0;

  const [problemsVisible, setProblemsVisible] = useState(hasActiveProblems);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleProblems = () => setProblemsVisible(prev => !prev);

  return {
    activeProblems,
    totalCount,
    criticalCount,
    hasActiveProblems,
    hasAnyProblems,
    problemsVisible,
    modalOpen,
    setModalOpen,
    toggleProblems,
  };
};
