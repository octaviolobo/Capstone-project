
import Sidebar from './sidebar';



function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
export default Layout;