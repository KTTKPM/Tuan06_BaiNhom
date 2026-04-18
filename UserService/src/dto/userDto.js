class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.role = user.role;
    }
}

module.exports = { UserResponseDTO };