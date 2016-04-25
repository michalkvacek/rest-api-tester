var passport = require ('passport');
// LocalStrategy = require ('passport-local').Strategy,
// bcrypt = require ('bcryptjs');

// function findByUsername(u, fn) {
// 	User.findOne ({
// 		username: u
// 	}).exec (function (err, user) {
// 		// Error handling
// 		if (err) {
// 			return fn (null, null);
// 			// The User was found successfully!
// 		} else {
// 			return fn (null, user);
// 		}
// 	});
// }

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser (function (user, done) {
	return done (null, user.id);
});

passport.deserializeUser (function (id, done) {
	users.findById (id).then (function (user) {
		delete user.password;

		return done (null, user);
	}).catch (function (err) {
		return done (err, null);
	});
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
// passport.use (new LocalStrategy ({
// 		usernameField: 'email',
// 		passwordField: 'password'
// 	},
// 	function (username, password, done) {
// 		// asynchronous verification, for effect...
// 		process.nextTick (function () {
// 			// Find the user by username. If there is no user with the given
// 			// username, or the password is not correct, set the user to `false` to
// 			// indicate failure and set a flash message. Otherwise, return the
// 			// authenticated `user`.
// 			findByUsername (username, function (err, user) {
// 				if (err)
// 					return done (null, err);
// 				if (!user) {
// 					return done (null, false, {
// 						message: 'Unknown user ' + username
// 					});
// 				}
// 				bcrypt.compare (password, user.password, function (err, res) {
// 					if (!res)
// 						return done (null, false, {
// 							message: 'Invalid Password'
// 						});
// 					var returnUser = {
// 						username: user.username,
// 						createdAt: user.createdAt,
// 						id: user.id
// 					};
// 					return done (null, returnUser, {
// 						message: 'Logged In Successfully'
// 					});
// 				});
// 			})
// 		});
// 	}
// ));