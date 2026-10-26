export const toFieldErrors = (zodError) => {
  const fieldErrors = {};
  zodError.issues.forEach((issue) => {
    const field = issue.path[0];
    if (!fieldErrors[field]) fieldErrors[field] = issue.message;
  });
  return fieldErrors;
};