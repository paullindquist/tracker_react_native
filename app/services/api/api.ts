/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
  ApiFeedResponse,
  ApiSubjectsResponse,
  ApiTokenResponse,
  ApiUserResponse,
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import type { SubjectSnapshotIn, SubjectSnapshotOut } from "../../models/subject/Subject"
import type { UserSnapshotIn } from "../../models/user/User"
import type { SettingSnapshotIn } from "app/models/setting/Setting"
import { SubjectItem } from "../api/api.types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    const headers = {
      Accept: "application/json",
    }
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers,
    })
  }

  /**
   * Gets the currently logged in user
   */
  async getSetting(): Promise<{ kind: "ok"; settings: SettingSnapshotIn[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/settings`)

    console.log("response: " + JSON.stringify(response, null, 2))
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      if (rawData) {
        const user = rawData
        console.log("RAWDATA", rawData)
        return { kind: "ok", user }
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
    return { kind: "unknown", temporary: true }
  }

  /**
   * Gets the currently logged in user
   */
  async getUser(): Promise<{ kind: "ok"; user: UserSnapshotIn } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiUserResponse> = await this.apisauce.get(`api/user`)

    console.log("response: " + response)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      if (rawData) {
        const user = rawData
        console.log("RAWDATA", rawData)
        return { kind: "ok", user }
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
    return { kind: "unknown", temporary: true }
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )
    console.log("response: " + response)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async login(email: string, password: string): Promise<GeneralApiProblem | ApiTokenResponse> {
    try {
      const response: ApiResponse<ApiTokenResponse> = await this.apisauce.post(`api/login`, {
        email,
        password,
      })
      console.log("login response:", JSON.stringify(response, null, 2))
      if (response) {
        if (response.data?.token) {
          return { token: response.data.token }
        } else {
          const apiProblem = getGeneralApiProblem(response)
          if (apiProblem) {
            return apiProblem
          }
        }
      }
    } catch (e) {
      console.error("Failed to login:", e)
    }
    return { kind: "unknown", temporary: true }
  }

  async refresh(): Promise<GeneralApiProblem | ApiTokenResponse> {
    try {
      const response: ApiResponse<ApiTokenResponse> = await this.apisauce.post(`api/refreshToken`)
      console.log("login response:", JSON.stringify(response, null, 2))
      if (response) {
        if (response.data?.token) {
          return { token: response.data.token }
        } else {
          const apiProblem = getGeneralApiProblem(response)
          if (apiProblem) {
            return apiProblem
          }
        }
      }
    } catch (e) {
      console.error("Failed to login:", e)
    }
    return { kind: "unknown", temporary: true }
  }

  async getSubjects(): Promise<{ kind: "ok"; subjects: SubjectSnapshotOut[] } | GeneralApiProblem> {
    try {
      const response: ApiResponse<ApiSubjectsResponse> = await this.apisauce.get(`/api/subjects`)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        let subjects: SubjectSnapshotOut[]
        if (response.data?.subjects) {
          subjects = response.data.subjects
        } else {
          subjects = []
        }
        return { kind: "ok", subjects }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    } catch (e) {
      console.log("Error: getSubjects()", e)
    }
    return { kind: "rejected" }
  }

  async createSubject(
    subject: SubjectSnapshotIn,
  ): Promise<{ kind: "ok"; subject: SubjectSnapshotIn } | GeneralApiProblem> {
    try {
      const response: ApiResponse<ApiSubjectsResponse> = await this.apisauce.post(
        `/api/subjects`,
        subject,
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawData = response.data

        // This is where we transform the data into the shape we expect for our MST model.
        const createdSubject: SubjectSnapshotIn = rawData?.subject

        return { kind: "ok", subject: createdSubject }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    } catch (e) {
      console.log("foo", e)
    }
    return { kind: "rejected" }
  }

  async deleteSubject(
    subject: SubjectSnapshotIn,
  ): Promise<{ kind: "ok"; subject: SubjectSnapshotIn } | GeneralApiProblem> {
    try {
      const response: ApiResponse<ApiSubjectsResponse> = await this.apisauce.delete(
        `/api/subjects`,
        subject,
      )

      // TODO: THIS!!!!
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      // transform the data into the format we are expecting
      try {
        const rawData = response.data

        // This is where we transform the data into the shape we expect for our MST model.
        const createdSubject: SubjectSnapshotIn = rawData?.subject

        return { kind: "ok", subject: createdSubject }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    } catch (e) {
      console.log("foo", e)
    }
    return { kind: "rejected" }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
