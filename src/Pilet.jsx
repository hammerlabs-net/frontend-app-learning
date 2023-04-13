import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { PageRoute } from '@edx/frontend-platform/react';

import reduxConfig from './data/module';

import DiscussionTab from './course-home/discussion-tab/DiscussionTab';

import { UserMessagesProvider } from './generic/user-messages';
import NoticesProvider from './generic/notices';
import PathFixesProvider from './generic/path-fixes';

import OutlineTab from './course-home/outline-tab';
import { CourseExit } from './courseware/course/course-exit';
import CoursewareContainer from './courseware';
import CoursewareRedirectLandingPage from './courseware/CoursewareRedirectLandingPage';
import DatesTab from './course-home/dates-tab';
import GoalUnsubscribe from './course-home/goal-unsubscribe';
import ProgressTab from './course-home/progress-tab/ProgressTab';
import { TabContainer } from './tab-page';

import { fetchDatesTab, fetchOutlineTab, fetchProgressTab } from './course-home/data';
import { fetchCourse } from './courseware/data';
import { fetchDiscussionTab, fetchLiveTab } from './course-home/data/thunks';
import LiveTab from './course-home/live-tab/LiveTab';
import CourseAccessErrorPage from './generic/CourseAccessErrorPage';
import DecodePageRoute from './decode-page-route';

import './index.scss';

const BASE_PATH = '/learning';

const piletSpec = {
  name: 'openEdx Learning MFE - Pilet Version',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  setup(piralApi) {
    const wrapApp = (pageComponent) => (
      <DynamicModuleLoader modules={[reduxConfig]}>
        <PathFixesProvider>
          <NoticesProvider>
            <UserMessagesProvider>
              {pageComponent()}
            </UserMessagesProvider>
          </NoticesProvider>
        </PathFixesProvider>
      </DynamicModuleLoader>
    );

    piralApi.registerPage(BASE_PATH, () => wrapApp(() => (
      <div>
        <h1>Welcome to Learning</h1>
        <p>Go to <Link to="/learning/course/course-v1:edX+DemoX+Demo_Course/home">the default course</Link></p>
      </div>
    )));
    piralApi.registerPage(`${BASE_PATH}/course/:courseId/home`, () => wrapApp(() => (
      <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
        <OutlineTab />
      </TabContainer>
    )));
  },

};
export default piletSpec;




const AppView = () => (
  <PathFixesProvider>
    <NoticesProvider>
      <UserMessagesProvider>
        <div>Hello World</div>
        <PageRoute exact path={`${BASE_PATH}/goal-unsubscribe/:token`} component={GoalUnsubscribe} />
        <PageRoute path={`${BASE_PATH}/redirect`} component={CoursewareRedirectLandingPage} />
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/access-denied`} component={CourseAccessErrorPage} />
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/home`}>
          <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
            <OutlineTab />
          </TabContainer>
        </DecodePageRoute>
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/live`}>
          <TabContainer tab="lti_live" fetch={fetchLiveTab} slice="courseHome">
            <LiveTab />
          </TabContainer>
        </DecodePageRoute>
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/dates`}>
          <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
            <DatesTab />
          </TabContainer>
        </DecodePageRoute>
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/discussion/:path*`}>
          <TabContainer tab="discussion" fetch={fetchDiscussionTab} slice="courseHome">
            <DiscussionTab />
          </TabContainer>
        </DecodePageRoute>
        <DecodePageRoute
          path={[
            `${BASE_PATH}/course/:courseId/progress/:targetUserId/`,
            `${BASE_PATH}/course/:courseId/progress`,
          ]}
          render={({ match }) => (
            <TabContainer
              tab="progress"
              fetch={(courseId) => fetchProgressTab(courseId, match.params.targetUserId)}
              slice="courseHome"
            >
              <ProgressTab />
            </TabContainer>
          )}
        />
        <DecodePageRoute path={`${BASE_PATH}/course/:courseId/course-end`}>
          <TabContainer tab="courseware" fetch={fetchCourse} slice="courseware">
            <CourseExit />
          </TabContainer>
        </DecodePageRoute>
        <DecodePageRoute
          path={[
            `${BASE_PATH}/course/:courseId/:sequenceId/:unitId`,
            `${BASE_PATH}/course/:courseId/:sequenceId`,
            `${BASE_PATH}/course/:courseId`,
          ]}
          component={CoursewareContainer}
        />
      </UserMessagesProvider>
    </NoticesProvider>
  </PathFixesProvider>
);
