export default function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter' });
  } else {
    console.log(`ERROR caught by handler: ${err}`);
  }
}
