const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//1.创建骨架
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '行程必须有名字'],
      unique: [true, '行程必须唯一'],
      validate: validator.isAlpha
    },
    duration: {
      type: Number,
      required: [true, '行程必须有时长']
    },
    maxGroupSize: {
      type: Number,
      required: [true, '行程必须有最大人数']
    },
    difficulty: {
      type: String,
      required: [true, '必须填写难度'],
      enum: {
        values: ['easy', 'normal', 'difficulty'],
        message: '{VALUE}难度选择错误'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, '行程必须有价格']
    },
    priceDiscounts: {
      type: Number,
      required: [true, '折扣必须添加'],
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: '{VALUE}不能高于售价'
      }
    },
    summary: {
      type: String,
      required: [true, '行程必须有简介'],
      trim: true
    },
    description: {
      type: String,
      required: [true, '行程必须有简介'],
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, '行程必须有封面']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false //不显示该字段
    },
    images: [String],
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

//虚拟字段
tourSchema.virtual('durationWeeks').get(function() {
  return Math.ceil(this.duration / 7);
});

//前置中间件
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function(doc, next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//查询中间件
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne',function(next){
//   this.find({secretTour : {$ne : true}});
//   next();
// });
tourSchema.post(/^find/, function(docs, next) {
  console.log(docs);
  console.log('执行时间为:', `${Date.now() - this.start}ms`);
  next();
});

//聚合管道中间件
tourSchema.pre('aggregate', function(next) {
  console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: false } } });
  next();
});

tourSchema.post('aggregate', function(next) {});

//2.创建模型
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
