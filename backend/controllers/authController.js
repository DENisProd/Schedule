import passport from "passport";

class AuthController {
    index (req, res) {

    }
    vkStart (req, res) {
        passport.authenticate("vkontakte")(req, res)
    }
    yaStart (req, res) {
        passport.authenticate("yandex")(req, res)
    }
    success (req, res) {
        if (req.user) {
            res.status(200).json({
                error: false,
                message: "Successfully Loged In",
                user: req.user,
            });
        } else {
            res.status(403).json({ error: true, message: "Not Authorized" });
        }
    }

    failed (req, res) {
        res.status(401).json({
            error: true,
            message: "Log in failure",
        });
    }

    vkCallback (req, res) {
        passport.authenticate("vkontakte", {
            successRedirect: "/login/success",
            failureRedirect: "/login/failed",
        })(req, res)
    }

    yaCallback (req, res) {
        passport.authenticate("yandex", {
            successRedirect: "/login/success",
            failureRedirect: "/login/failed",
        })(req, res)
    }

    logout (req, res) {
        req.logout();
        res.redirect(process.env.CLIENT_URL);
    }
}

export default AuthController