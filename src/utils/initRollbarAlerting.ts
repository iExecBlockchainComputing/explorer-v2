import Rollbar from 'rollbar';

export const isRollbarActivated =
  import.meta.env.MODE === 'production' &&
  import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN;

export function initRollbarAlerting() {
  let rollbar: Rollbar | undefined;
  let rollbarConfig:
    | { accessToken: string; environment: 'development' | 'production' }
    | undefined;

  if (isRollbarActivated) {
    rollbarConfig = {
      accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
      environment:
        import.meta.env.MODE === 'production' ? 'production' : 'development',
    };

    rollbar = new Rollbar(rollbarConfig);
  }

  return { rollbar, rollbarConfig };
}
