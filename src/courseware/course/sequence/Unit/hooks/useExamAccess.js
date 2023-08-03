import React from 'react';

import { StrictDict, useKeyedState } from '@edx/react-unit-test-utils';
import { getExamAccess, fetchExamAccess, isExam } from '@edx/frontend-lib-special-exams';
import { logError } from '../../../../../data/api';

export const stateKeys = StrictDict({
  accessToken: 'accessToken',
  blockAccess: 'blockAccess',
});

const useExamAccess = ({
  id,
}) => {
  const [accessToken, setAccessToken] = useKeyedState(stateKeys.accessToken, '');
  const [blockAccess, setBlockAccess] = useKeyedState(stateKeys.blockAccess, isExam());
  React.useEffect(() => {
    if (isExam()) {
      return fetchExamAccess()
        .finally(() => {
          const examAccess = getExamAccess();
          setAccessToken(examAccess);
          setBlockAccess(false);
        })
        .catch((error) => {
          logError(error);
        });
    }
    return undefined;
  }, [id]);

  return {
    blockAccess,
    accessToken,
  };
};

export default useExamAccess;
