export interface UseCase<D, R> {
	execute(data: D): Promise<R>
}
