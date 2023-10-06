import User from "../models/user.js";

class UserService {
    findUserByUid = async (uid) => {
        return await User.findOne({clientId: uid});
    }


}

export default UserService