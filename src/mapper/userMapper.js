const mobieUserMapper = {
  name: 'fullname',
  email: 'email',
  created: 'created',
  latest: 'latest'
}

const webUserMapper = {
  name: 'full_name',
  email: {
    field: 'login_id',
    transform: (o) => o.email
  },
  created: {
    field: 'created_date',
    transform: (o) => new Date(o.created*1000).toISOString().slice(0, 19).replace('T',' ')
  },
  latest: {
    field: 'latest_login',
    transform: (o) => new Date(o.latest*1000).toISOString().slice(0, 19).replace('T',' ')
  }
}

module.exports = {
  mobieUserMapper,
  webUserMapper
}
