import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { DynamicModuleLoader } from 'redux-dynamic-modules';
import * as React from 'react';
import { Link } from 'react-router-dom';

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
import appMessages from './i18n';


const BASE_PATH = '/learning';

// eslint-disable-next-line import/prefer-default-export
export function setup(piralApi) {
  piralApi.mergeMessages(appMessages);

  piralApi.mergeConfig({
    CONTACT_URL: process.env.CONTACT_URL || null,
    CREDENTIALS_BASE_URL: process.env.CREDENTIALS_BASE_URL || null,
    CREDIT_HELP_LINK_URL: process.env.CREDIT_HELP_LINK_URL || null,
    DISCUSSIONS_MFE_BASE_URL: process.env.DISCUSSIONS_MFE_BASE_URL || null,
    ENTERPRISE_LEARNER_PORTAL_HOSTNAME: process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME || null,
    ENABLE_JUMPNAV: process.env.ENABLE_JUMPNAV || null,
    ENABLE_NOTICES: process.env.ENABLE_NOTICES || null,
    INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
    SEARCH_CATALOG_URL: process.env.SEARCH_CATALOG_URL || null,
    SOCIAL_UTM_MILESTONE_CAMPAIGN: process.env.SOCIAL_UTM_MILESTONE_CAMPAIGN || null,
    STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
    SUPPORT_URL: process.env.SUPPORT_URL || null,
    SUPPORT_URL_CALCULATOR_MATH: process.env.SUPPORT_URL_CALCULATOR_MATH || null,
    SUPPORT_URL_ID_VERIFICATION: process.env.SUPPORT_URL_ID_VERIFICATION || null,
    SUPPORT_URL_VERIFIED_CERTIFICATE: process.env.SUPPORT_URL_VERIFIED_CERTIFICATE || null,
    TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL || null,
    TWITTER_HASHTAG: process.env.TWITTER_HASHTAG || null,
    TWITTER_URL: process.env.TWITTER_URL || null,
    LEGACY_THEME_NAME: process.env.LEGACY_THEME_NAME || null,
    EXAMS_BASE_URL: process.env.EXAMS_BASE_URL || null,
  }, 'LearnerAppConfig');

  const platformApi = {
    getAuthenticatedUser: piralApi.getAuthenticatedUser,
    getAuthenticatedHttpClient: piralApi.getAuthenticatedHttpClient,
    getConfig: piralApi.getConfig,
    logInfo: piralApi.logInfo,
    logError: piralApi.logError,
  };

  const wrapApp = (pageComponent) => (
    <DynamicModuleLoader modules={[reduxConfig(platformApi)]}>
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
    <div style={{ margin: '1em' }}>
      <h1>Welcome to Learning</h1>
      <p>Go to <Link to="/learning/course/course-v1:edX+DemoX+Demo_Course/home">the default course</Link></p>
    </div>
  )));
  piralApi.registerPage(`${BASE_PATH}/goal-unsubscribe/:token`, () => wrapApp(() => (
    <GoalUnsubscribe />
  )));
  piralApi.registerPage(`${BASE_PATH}/redirect`, () => wrapApp(() => (
    <CoursewareRedirectLandingPage />
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/access-denied`, () => wrapApp(() => (
    <CourseAccessErrorPage />
  )));

  piralApi.registerPage(`${BASE_PATH}/course/:courseId/home`, () => wrapApp(() => (
    <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
      <OutlineTab />
    </TabContainer>
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/live`, () => wrapApp(() => (
    <TabContainer tab="lti_live" fetch={fetchLiveTab} slice="courseHome">
      <LiveTab />
    </TabContainer>
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/dates`, () => wrapApp(() => (
    <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
      <DatesTab />
    </TabContainer>
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/discussion/:path*`, () => wrapApp(() => (
    <TabContainer tab="discussion" fetch={fetchDiscussionTab} slice="courseHome">
      <DiscussionTab />
    </TabContainer>
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/progress`, () => wrapApp(() => (
    <TabContainer
      tab="progress"
      fetch={(courseId) => fetchProgressTab(courseId)}
      slice="courseHome"
    >
      <ProgressTab />
    </TabContainer>
  )));
  piralApi.registerPage(`${BASE_PATH}/course/:courseId/discussion/:path*`, () => wrapApp(() => (
    <TabContainer tab="courseware" fetch={fetchCourse} slice="courseware">
      <CourseExit />
    </TabContainer>
  )));
  piralApi.registerPage([
    `${BASE_PATH}/course/:courseId/:sequenceId/:unitId`,
    `${BASE_PATH}/course/:courseId/:sequenceId`,
    `${BASE_PATH}/course/:courseId`,
  ], () => wrapApp(() => (
    <CoursewareContainer />
  )));
}
