import axiosInstance from '@/helpers/axios-instance';
import { AuthData } from '@/lib/types';
import userState from '@/utils/user-state';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthData = (): AuthData => {
  const location = useLocation(); // call the hook
  const user = userState.getUser();

  const [data, setData] = useState<AuthData>({
    _id: user?._id || '',
    role: user?.role || '',
    token: '',
    loading: true,
  });

  // Reset token when user changes
  useEffect(() => {
    setData(prev => ({ ...prev, token: '', loading: true }));
  }, [user?._id]);

  // Fetch token when user._id exists or location changes
  useEffect(() => {
    if (!data._id) return; // skip if no user id

    const fetchToken = async () => {
      try {
        const res = await axiosInstance.get(`/auth/check/${data._id}`);
        setData(prev => ({
          ...prev,
          token: res.data?.data || '',
          loading: false,
        }));
      } catch (error) {
        console.error('Error fetching token:', error);
        setData(prev => ({
          ...prev,
          token: '',
          loading: false,
        }));
      }
    };

    fetchToken();
  }, [data._id, location]);

  return data;
};

export default useAuthData;
