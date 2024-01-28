import { ParseDate } from "./date";
import { ParseFile } from "./file";
import { ParseObject } from "./object";
import { ParsePointer, PointerPath, PointerTypeToClassMap } from "./pointer";
import { Query } from "./query";
import {
  ObjectResponse,
  ParseError,
  QueryResponse,
  ServerError,
} from "./response";
import { User } from "./user";

export type {
  ObjectResponse,
  ParseDate,
  ParseFile,
  ParseObject,
  ParsePointer,
  PointerPath,
  PointerTypeToClassMap,
  Query,
  QueryResponse,
  ServerError,
  User,
};

export type ParseClasses = keyof PointerTypeToClassMap;

const USER_AGENT = "Dart/2.16 (dart:io)";

interface GetObjectRequestProps<
  T extends ParseClasses,
  I extends PointerPath<PointerTypeToClassMap[T]> = never,
> {
  classname: T;
  objectId: string;
  include?: I[];
}

interface GetObjectsRequestProps<
  T extends ParseClasses,
  I extends PointerPath<PointerTypeToClassMap[T]> = never,
> {
  classname: T;
  query?: Query<PointerTypeToClassMap[T], I>;
}

export default class Client {
  #applicationId: string;
  #clientKey: string;

  #baseUrl: string | undefined;
  #sessionToken: string | undefined;

  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    let { headers = {} } = init;
    if (Array.isArray(headers)) {
      headers = Object.fromEntries(headers);
    } else if (headers instanceof Headers) {
      // @ts-ignore
      headers = Object.fromEntries(headers.entries());
    }

    headers = {
      ...headers,
      "User-Agent": USER_AGENT,
      "X-Parse-Application-Id": this.#applicationId,
      "X-Parse-Client-Key": this.#clientKey,
    };

    if (this.#sessionToken != null) {
      headers["X-Parse-Session-Token"] = this.#sessionToken;
    }

    const url = `${this.#baseUrl}${path}`;
    const response = await fetch(url, { ...init, headers });

    if (response.status !== 200) {
      const json: ParseError = await response.json();

      throw new ServerError(json);
    }

    return response;
  }

  buildSearchParamsFromQuery({
    where,
    include = [],
    order = [],
  }: Query<any, any>) {
    const params: [string, string][] = [];

    if (where) {
      params.push(["where", JSON.stringify(where)]);
    }

    if (include.length > 0) {
      params.push(["include", include.join(",")]);
    }

    if (order.length > 0) {
      params.push(["order", order.join(",")]);
    }

    return params
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  }

  constructor(applicationId: string, clientKey: string) {
    this.#applicationId = applicationId;
    this.#clientKey = clientKey;
  }

  setSessionToken(sessionToken: string | undefined): void {
    this.#sessionToken = sessionToken;
  }

  setBaseUrl(baseUrl: string): void {
    this.#baseUrl = baseUrl;
  }

  async login(username: string, password: string): Promise<User> {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const response = await this.fetch(
      `/login?username=${encodedUsername}&password=${encodedPassword}`,
    );

    const json: User = await response.json();
    const { sessionToken } = json;
    this.setSessionToken(sessionToken);

    return json;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.fetch("/users/me");
    return response.json();
  }

  async getObject<
    T extends ParseClasses,
    I extends PointerPath<PointerTypeToClassMap[T]>,
  >(
    { classname, objectId, include }: GetObjectRequestProps<T, I>,
    init?: RequestInit,
  ): Promise<ObjectResponse<PointerTypeToClassMap[T], I>> {
    let searchParams = "";
    if (include) {
      searchParams = `?${this.buildSearchParamsFromQuery({ include })}`;
    }
    const response = await this.fetch(
      `/classes/${classname}/${objectId}${searchParams}`,
      init,
    );

    return response.json();
  }

  async updateObject<T extends ParseClasses>(
    className: T,
    id: string,
    body: Partial<PointerTypeToClassMap[T]>,
  ): Promise<{ updatedAt: string }> {
    const response = await this.fetch(`/classes/${className}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    return response.json();
  }

  async getObjects<
    T extends ParseClasses,
    I extends PointerPath<PointerTypeToClassMap[T]>,
  >(
    { classname, query }: GetObjectsRequestProps<T, I>,
    init?: RequestInit,
  ): Promise<QueryResponse<PointerTypeToClassMap[T], I>> {
    let searchParams = "";
    if (query) {
      searchParams = `?${this.buildSearchParamsFromQuery(query)}`;
    }
    const response = await this.fetch(
      `/classes/${classname}${searchParams}`,
      init,
    );

    return response.json();
  }
}
