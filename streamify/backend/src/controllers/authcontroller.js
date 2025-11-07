const signup = async (req,res) =>{
    res.send("Signup Route");
}

const login = async (req,res) =>{
    res.send("Login Route");
}

const logout = async (req,res) =>{
    res.send("Logout Route");
}

module.exports = { signup, login, logout };