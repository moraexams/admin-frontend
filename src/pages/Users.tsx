import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { User} from '../types/types';
import { getUsers } from '../services/userService';
import UsersTable from '../components/Tables/UsersTable';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const users = await getUsers();
              setUsers(users);
          } catch (error) {
              setError('Failed to fetch users');
          } finally {
              setLoading(false);
          }
      };

      fetchUsers();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        {loading ? <div>Loading...</div> : <UsersTable userData={users} itemsPerPage={3} />}
      </div>
    </DefaultLayout>
  );
};

export default Users;
