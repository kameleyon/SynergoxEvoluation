export const createProject = (projectName) => {
  return {
    id: Date.now(),
    name: projectName,
    status: 'In Progress',
  };
};
