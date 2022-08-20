import axios from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import Loading from '../components/Loading';
import { instance } from '../lib/axios';

interface AuthContextInterface {
  user: User | null;
  registerUser: (user: RegisterUserDto) => Promise<AuthReturn<User> | null>;
  loginUser: (user: LoginUser) => Promise<AuthReturn<User> | null>;
  logOut: () => void;
  loading: boolean;
}

interface RegisterUserDto {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
}

interface LoginUser {
  email: string;
  password: string;
}

interface AuthReturn<T> {
  data: T | null;
  error: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await instance.get<User>('/user/current');
        if (!currentUser) {
          return setUser(null);
        }
        setUser(currentUser.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const registerUser = async ({
    name,
    email,
    password,
    phoneNumber,
    role
  }: RegisterUserDto): Promise<AuthReturn<User> | null> => {
    const obj: AuthReturn<User> = { data: null, error: [] };

    try {
      const user = await instance.post<User>('/auth/register', {
        name,
        email,
        password,
        phoneNumber,
        role
      });

      if (!user) {
        obj.error = ['something went wrong'];
        obj.data = null;
        return obj;
      }

      setUser(user.data);
      obj.data = user.data;
      obj.error = [];
      return obj;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error(err);
        if (err?.response?.data) {
          obj.data = null;
          //@ts-ignore
          obj.error.push(...err.response.data.message);
          return obj;
        }
        obj.data = null;
        obj.error.push(err.message);
        return obj;
      }
      // error
      console.error(err);
      obj.error.push(`something went wrong - ${err?.message}`);
      return { ...obj, data: null };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ({
    email,
    password
  }: LoginUser): Promise<AuthReturn<User> | null> => {
    const obj: AuthReturn<User> = { data: null, error: [] };
    setLoading(true);

    try {
      const loggedInUser = await instance.post<User>('/auth/login', {
        email,
        password
      });

      if (!loggedInUser) {
        console.log('herr');
        obj.error.push('something went wrong please try again');
        return obj;
      }

      setUser({ ...loggedInUser.data });
      setLoading(false);

      obj.data = loggedInUser.data;
      obj.error = [];
      return obj;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error(err);
        if (err?.response?.data) {
          obj.data = null;
          //@ts-ignore
          if (typeof err.response.data.message === 'string') {
            //@ts-ignore
            obj.error.push(err.response.data.message);
            return obj;
          } else {
            //@ts-ignore
            obj.error.push(...err.response.data.message);
            return obj;
          }
        }
        obj.data = null;
        obj.error.push(err.message);
        return obj;
      }
      // error
      console.error(err);
      obj.error.push(`something went wrong - ${err?.message}`);
      return { ...obj, data: null };
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    const logout = await instance.get('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ registerUser, user, loading, loginUser, logOut }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  try {
    const auth = useContext(AuthContext);

    return auth;
  } catch (err) {
    console.log('context should be inside auth provider', err);
  }
};
