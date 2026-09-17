/** Not part of the Rewamp set — placeholder so the nav item resolves. */
import { Card } from '../components/ui';
import { Page, PageHeader } from '../components/app/AppLayout';

export default function Dashboard() {
  return (
    <Page>
      <PageHeader title="Team Dashboard" />
      <Card className="p-10 text-center">
        <p className="text-sm text-muted">
          This screen has not been designed yet. It is in the navigation because the design system
          menu lists it, but there is no Rewamp frame behind it.
        </p>
      </Card>
    </Page>
  );
}
