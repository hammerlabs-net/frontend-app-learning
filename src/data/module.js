import { reducer as courseHomeReducer } from '../course-home/data';
import { reducer as coursewareReducer } from '../courseware/data/slice';
import { reducer as recommendationsReducer } from '../courseware/course/course-exit/data/slice';
import { reducer as toursReducer } from '../product-tours/data';
import { reducer as modelsReducer } from '../generic/model-store';
import { configure } from './api';

export default function (platformApi) {
  configure(platformApi);

  return {
    id: 'learningSettings',
    reducerMap: {
      models: modelsReducer,
      courseware: coursewareReducer,
      courseHome: courseHomeReducer,
      recommendations: recommendationsReducer,
      tours: toursReducer,
    },
  };
}
