const { hashPassword, comparePassword }  = require('utils/crypto');
const { generateKey, generateTOTP } = require('utils/otp')
const user                               = require('schemas/user');
const { transform }                      = require('utils/transform');
const { mobieUserMapper, webUserMapper } = require('mapper/userMapper');
const { writeDataSync } = require('utils/writeData')
const { updateData } = require('utils/updateData')
const { count: countData, find: findAll, findOne} = require('utils/findData')
const { v4: uuidv4 } = require('uuid');
const { DATA_PATH } = require('constants.js')

const createUser = async (model, device) => {
  try {
    // @TODO validation model
    const currentTime   = Math.floor(Date.now() / 1000);
    const password_hash = await hashPassword(model.password);

    // const createdUser   = await user.create({
    //   name:    model.name,
    //   email:   model.email,
    //   password_hash,
    //   temporary_key: key,
    //   created: currentTime,
    //   latest:  currentTime
    // });
    const userId = uuidv4();
    const path = DATA_PATH + '/user/' + userId + ':' + model.name + ':' +
      model.email.replace('@', 'U+0040').replace('.', 'U+002E') + ':' + currentTime;
    const createdUser = {
      _id: userId,
      name:    model.name,
      email:   model.email,
      password_hash,
      created: currentTime,
      latest:  currentTime
    };
    writeDataSync(path, JSON.stringify(createdUser));

    const mapper      = device === 'mobie' ? mobieUserMapper : webUserMapper;
    const mappingUser = transform(createdUser, mapper);

    return {
      success: true,
      data:    [mappingUser]
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      success: false,
      error:   error.errmsg || error.msg
    };
  }
};

const loginUser = async (model, device) => {
  // @TODO validation
  const dbUser = await findOne('user', { email: model.email})
  // const dbUser = await user.findOne({
  //   email: model.email
  // }).select({ _id: 1, name: 1, email: 1, password_hash: 1, temporary_key:1, created: 1, latest: 1 });

  if (!dbUser) {
    return {
      status: 400,
      error:  'invalid credential',
    };
  }

  const comparedPassword = await comparePassword(model.password, dbUser.password_hash);
  if (!comparedPassword) {
    return {
      status: 400,
      error:  'invalid credential',
    };
  }
  await updateData('user', Object.assign(dbUser, { temporary_key: generateKey() }))
  const token       = generateTOTP(dbUser.temporary_key);
  const mapper      = device === 'mobie' ? mobieUserMapper : webUserMapper;
  const mappingUser = transform(dbUser, mapper);
  return {
    success: true,
    userId: dbUser._id,
    uuid: token.uuid,
    data:    [mappingUser]
  };
};

const logoutUser = async (userId) => {
  const dbUser     = await findOne('user', { _id: userId })
  delete dbUser.temporary_key;
  await updateData('user', dbUser)
  // await dbUser.save()
  return {
    success: true,
  }
}

const findUsers = async ({ find = {}, skip = 0, limit = 10, select, sort = { created: 1 } }) => {
  const innerSelect = !select ? { _id: 1, name: 1 } : select;
  // const [items, count] = await Promise.all([
  //   user.find(find).sort(sort).skip(skip).limit(limit).select(innerSelect),
  //   limit && user.find(find).countDocuments()
  // ]);

  const [allItems, count] = await Promise.all([
    findAll('user', find),
    countData('user', find)
  ])

  allItems.sort((a, b) => sort.created === 1 ? a.created - b.created : b.created - a.created)
  const items = allItems.slice(skip, skip + limit).map((item) => {
    Object.keys(item).forEach((k) => {
      return !innerSelect[k] && delete item[k]
    })
    delete item.password_hash;
    delete item.temporary_key;
    return item
  })

  return {
    status: 200,
    data: {
      items,
      totalPages:  Math.ceil(count / limit) || 1,
      currentPage: Math.ceil((skip + 1) / limit) || 1,
    }
  };
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  findUsers,
};