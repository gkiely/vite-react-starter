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
