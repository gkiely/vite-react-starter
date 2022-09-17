interface Promise<T> {
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @link https://github.com/microsoft/TypeScript/issues/45602#issuecomment-934427206
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
}

// Type Object.keys and Object.entries
// https://stackoverflow.com/a/65079383/1845423
declare interface ObjectConstructor extends Omit<ObjectConstructor, 'keys' | 'entries'> {
  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys<O extends unknown[]>(obj: O): Array<keyof O>;
  keys<O extends Record<Readonly<string>, unknown>>(obj: O): Array<keyof O>;
  keys(obj: object): string[];

  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<T extends { [K: Readonly<string>]: unknown }>(obj: T): Array<[keyof T, T[keyof T]]>;
  entries<T extends object>(obj: { [s: string]: T } | ArrayLike<T>): [string, T[keyof T]][];
  entries<T>(obj: { [s: string]: T } | ArrayLike<T>): [string, T][];
  entries(obj: Record<string, unknown>): [string, unknown][];
}

declare const Object: ObjectConstructor;

declare interface ImportMetaEnv {
  TEST: boolean;
}
