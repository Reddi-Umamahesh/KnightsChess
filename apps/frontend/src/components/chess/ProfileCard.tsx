
const ProfileCard = ({ username}:{username:string}) => {
  return (
    <div>
      
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full overflow-hidden">
              <img
                src="https://www.chess.com/bundles/web/images/black_400.png"
                alt="Chess piece"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-gray-100 font-bold">{username}</h3>
              <p className="text-amber-500">In</p>
            </div>
        </div>
    </div>
  );
};

export default ProfileCard;
