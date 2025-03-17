import { authState } from '@/recoil/userAtoms';
import { Menu } from 'lucide-react'
import { useRecoilValue } from 'recoil';

const Header = () => {
    const auth = useRecoilValue(authState);
    const user = auth.user;
  return (
      <header className="py-8">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                  <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700">
                          <img
                              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                              alt="User avatar"
                              className="w-full h-full object-cover"
                          />
                      </div>
                  </div>
                  <div>
                      
                      <div className="flex items-center mt-1">
                          <div className="w-5 h-5 rounded-full bg-yellow-400 mr-2"></div>
                          {/* <span className="text-lg text-gray-300">10,000</span> */}
                          <p className="text-xl font-medium text-white">{user?.name || "Hero"}</p>
                      </div>
                  </div>
              </div>
              <button className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Menu size={28} />
              </button>
          </div>
      </header>
  )
}

export default Header