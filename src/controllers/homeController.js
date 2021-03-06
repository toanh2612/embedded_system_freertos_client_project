import homeService from "../services/homeService";
import handleSuccess from "../helpers/handleSuccess";
export default {
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id }
      await homeService.getOne(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  getAll: async (req, res, next) => {
    try {
      let { filter } = req.query;
      filter = filter || {};
      const param = { filter }
      await homeService.getAll(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  post: async (req, res, next) => {
    try {
      const entity = req.body;
      const param = { entity }
      await homeService.create(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      }).catch((e)=>{
        next(e)
      })
    } catch (e) {
      next(e)
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id }
      await homeService.destroy(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  },
  put: async (req, res, next) => {
    try {
      const entity = req.body;
      const { id } = req.params;
      const param = { id, entity };
      await homeService.update(param).then((result)=> {
        return handleSuccess({result}, req, res, next)
      })
    } catch (e) {
      next(e)
    }
  }
}
