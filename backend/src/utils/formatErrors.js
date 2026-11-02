export const formatErrors = (error) =>
  error.issues.map((issue) => ({ field: issue.path[0], message: issue.message }));