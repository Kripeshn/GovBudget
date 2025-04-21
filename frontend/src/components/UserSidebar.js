import { Link } from 'react-router-dom';

const UserSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">User</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/home" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/feedback" className="hover:bg-gray-700 p-2 rounded">Give Feedback</Link>
        <Link
          to="/login"
          onClick={() => localStorage.clear()}
          className="hover:bg-red-600 p-2 rounded"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default UserSidebar;
