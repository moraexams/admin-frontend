import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { User } from '../types/types';
import { getUsers } from '../services/userService';
import UsersTable from '../components/Tables/UsersTable';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

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

      <div className="mb-5.5">
        <select
          className="rounded border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          name="selectDoctor"
          id="selectDoctor"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="500">500</option>
        </select>
      </div>
      <div className="flex flex-col gap-10">
        {loading ? <div>Loading...</div> : <UsersTable userData={users} itemsPerPage={itemsPerPage} />}
      </div>
    </DefaultLayout>
  );
};

export default Users;
