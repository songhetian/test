const Tour = require('./../models/tourModel');

exports.getTopTours = (req, res, next) => {
  req.query.limit = 5;
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const query = Tour.find();
    const { page, limit } = req.query;

    //query.select({name:1,price:1,difficulty:1,ratingsQuantity:1,ratingsAverage:1,secretTour:1});
    //query.sort("-price");
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    }
    query.sort('-price -ratingsQuantity');
    const offset = (page - 1) * limit;
    query.skip(offset).limit(+limit);

    const tours = await query;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      message: '获取成功',
      data: tours
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id, { _id: 0, secretTour: 1 });
    res.status(200).json({
      status: 'Success',
      message: '获取成功',
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};

exports.creatTour = async (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'Success',
      message: '创建成功',
      data: newTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'Filed',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true``
    });
    res.status(200).json({
      status: 'Success',
      message: '更新成功',
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Success',
      message: '删除成功'
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};

exports.getStatusTours = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: {
          avgPrice: -1
        }
      },
      {
        $match: { _id: { $ne: 'EASY' } }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]);
    res.status(200).json({
      status: 'Success',
      message: '获取成功',
      data: stats
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};
//获取排序
exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' //解析数组变为单条
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-1-1`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStart: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $sort: { numTourStart: -1 }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      }
    ]);

    res.status(200).json({
      status: 'Success',
      message: '获取成功',
      requests: plan.length,
      data: plan
    });
  } catch (err) {
    res.status(404).json({
      status: 'Filed',
      message: err.message
    });
  }
};
