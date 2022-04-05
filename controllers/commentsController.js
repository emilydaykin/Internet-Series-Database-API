import Series from '../models/series.js';

const createComment = async (req, res, next) => {
  // THIS ISN'T GOING TO WORK YET UNTIL secureRoute IS SET UP!!!
  console.log('req current user:', req.currentUser);

  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).send({ message: 'Series not found' });
    } else {
      const newComment = {
        ...req.body,
        createdBy: req.currentUser.id
      };
      series.comments.push(newComment);
      const savedSeries = await series.save();
      return res.status(201).json(savedSeries);
    }
  } catch (err) {
    next(err);
  }
};

// helper function to be used in both UPDATE and DELETE comment
async function getSeriesAndCommentAndCheck(res, req, action) {
  const { id, commentId } = req.params;
  const series = await Series.findById(id);
  if (!series) {
    return res.status(404).send({ message: 'Series not found' });
  } else {
    const comment = series.comments.id(commentId);
    if (!comment) {
      return res.status(404).send({ message: 'Comment not found' });
    } else if (!comment.createdBy.equals(req.currentUser._id)) {
      return res.status(401).send({ message: 'Unauthorised action' });
    } else {
      if (action === 'update') {
        comment.set(req.body);
      } else if (action === 'delete') {
        comment.remove();
      } else {
        return 'action needs to be `update` or `delete`.';
      }
      const savedSeries = await series.save();
      return res.status(200).send(savedSeries);
    }
  }
}

const updateComment = async (req, res, next) => {
  try {
    getSeriesAndCommentAndCheck(res, req, 'update');
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    getSeriesAndCommentAndCheck(res, req, 'delete');
  } catch (err) {
    next(err);
  }
};

export default { createComment, updateComment, deleteComment };
