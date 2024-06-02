import JWT from 'jsonwebtoken';

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or improperly formatted' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // You can pass the decoded token to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
