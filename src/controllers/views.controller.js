class ViewController {
    async getMain(req, res) {
        res.redirect("/products");
    }

    async getLogin(req, res) {
        res.render("login");
    }
}

export const viewController = new ViewController();
