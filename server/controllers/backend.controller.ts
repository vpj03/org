// New backend controller for connection testing
export const checkBackendConnection = async (_req, res) => {
  // ...existing code (if any)...
  res.status(200).json({ message: 'Backend connection successful' });
};
