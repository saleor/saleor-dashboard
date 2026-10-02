import { type APIRequestContext } from "@playwright/test";

const APPS_QUERY = `
  query FetchAppsForSmokeTest {
    apps(first: 100) {
      edges {
        node {
          id
          identifier
        }
      }
    }
  }
`;

interface AppsQueryResponse {
  data: {
    apps: {
      edges: Array<{
        node: {
          id: string;
          identifier: string | null;
        };
      }>;
    };
  };
}

/** Fetch list of apps to be used in smoke tests
 * when request is already pending reuses existing promise
 * when we already fetched the list reuses fetched data */
export class AppsApiService {
  private readonly request: APIRequestContext;
  private readonly token: string;
  private fetchPromise: Promise<Map<string, string>> | null = null;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  async getAppIdByIdentifier(identifier: string): Promise<string> {
    const appMap = await this.getAppMap();
    const appId = appMap.get(identifier);

    if (!appId) {
      throw new Error(`App with identifier "${identifier}" not found in Saleor`);
    }

    return appId;
  }

  private getAppMap(): Promise<Map<string, string>> {
    if (!this.fetchPromise) {
      this.fetchPromise = this.fetchAppMap();
    }

    return this.fetchPromise;
  }

  private async fetchAppMap(): Promise<Map<string, string>> {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      throw new Error("API_URL environment variable is not set");
    }

    const response = await this.request.post(apiUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: { query: APPS_QUERY },
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch apps: ${response.status()} ${response.statusText()}`);
    }

    const json: AppsQueryResponse = await response.json();

    if (json.data?.apps?.edges === undefined) {
      throw new Error(`Unexpected API response: ${JSON.stringify(json).slice(0, 500)}`);
    }

    return new Map(
      json.data.apps.edges
        .filter(
          (edge): edge is { node: { id: string; identifier: string } } =>
            edge.node.identifier !== null,
        )
        .map(edge => [edge.node.identifier, edge.node.id]),
    );
  }
}
