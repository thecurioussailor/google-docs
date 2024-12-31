import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="h-20 px-10 flex justify-between items-center">
        <h1 className="font-semibold text-xl">Google Docs</h1>
        <ul className="flex gap-4">
            <Link to={'/documents'}><li>All Docs</li></Link>
            <Link to={'/signin'}><li>Sign in</li></Link>
            <Link to={'/signout'}><li>Sign out</li></Link>
        </ul>
    </nav>
  )
}

export default Navbar