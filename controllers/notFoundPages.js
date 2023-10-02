const handleNotFound = (req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена.' });
};

module.exports = handleNotFound;
