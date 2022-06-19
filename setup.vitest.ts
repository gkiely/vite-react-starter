import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

// Disable hidden check for better perf
// https://testing-library.com/docs/dom-testing-library/api-configuration#defaulthidden
// https://github.com/testing-library/dom-testing-library/issues/552#issuecomment-626718645
configure({ defaultHidden: true, testIdAttribute: 'data-test-id' });
