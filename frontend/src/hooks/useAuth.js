import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken, selectIsAuthenticated } from '../store/slices/authSlice';

/**
 * Custom hook to access auth state
 * @returns {{ user: Object, token: string, isAuthenticated: boolean }}
 */
const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return { user, token, isAuthenticated };
};

export default useAuth;
