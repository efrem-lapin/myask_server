export default class UserDto {
    id;
    email;
    name;
    surname;
    status;
    avatar;
    subscriptions;

    constructor(model) {
        this.id            = model.id;
        this.email         = model.email;
        this.name          = model.name;
        this.surname       = model.surname;
        this.status        = model.status;
        this.avatar        = model.avatar;
        this.subscriptions = model.subscriptions;
    }
}