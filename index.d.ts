interface DataStore2<T> {
	/**
	 * Gets the result from the data store. Will yield the first time it is called.
	 * @param defaultValue The default result if there is no result in the data store.
	 * @param dontAttemptGet If there is no cached result, just return nil.
	 * @return The value in the data store if there is no cached result. The cached result otherwise.
	 */
	Get(defaultValue?: T, dontAttemptGet?: boolean): T;

	/**
	 * The same as :Get only it'll check to make sure all keys in the default data provided
	 * exist. If not, will pass in the default value only for that key.
	 * This is recommended for tables in case you want to add new entries to the table.
	 * Note this is not required for tables, it only provides an extra functionality.
	 * @param defaultValue A table that will have its keys compared to that of the actual data received.
	 * @return The value in the data store will all keys from the default value provided.
	 */
	GetTable(defaultValue?: object): T;

	/**
	 * Sets the cached result to the value provided
	 * @param value The value
	 */
	Set(value: T): void;

	/**
	 * Calls the function provided and sets the cached result.
	 * @param updateFunc The function
	 */
	Update(updateFunc: (oldValue: T) => T): void;

	/**
	 * Increment the cached result by value.
	 * @param value The value to increment by.
	 * @param defaultValue If there is no cached result, set it to this before incrementing.
	 */
	Increment(value: T, defaultValue?: T): void;

	/**
	 * Takes a function to be called whenever the cached result updates.
	 * @param callback The function to call.
	 */
	OnUpdate(callback: (value: T) => void): void;

	/**
	 * Takes a function to be called when :Get() is first called and there is a value in the data store.
	 * This function must return a value to set to. Used for deserializing.
	 * @param modifier The modifier function.
	 */
	BeforeInitialGet<U>(modifier: (value: U) => T): void;

	/**
	 * Takes a function to be called before :Save().
	 * This function must return a value that will be saved in the data store. Used for serializing.
	 * @param modifier The modifier function.
	 */
	BeforeSave<U>(modifier: (value: T) => U): void;

	/**
	 * Takes a function to be called after :Save().
	 * @param callback The callback function.
	 */
	AfterSave(callback: (value: T) => void): void;

	/**
	 * Adds a backup to the data store if :Get() fails a specified amount of times.
	 * Will return the value provided (if the value is nil, then the default value of :Get() will be returned)
	 * and mark the data store as a backup store, and attempts to :Save() will not truly save.
	 * @param retries Number of retries before the backup will be used.
	 * @param value The value to return to :Get() in the case of a failure.
	 * You can keep this blank and the default value you provided with :Get() will be used instead.
	 */
	SetBackup(retries: number, value?: T): void;

	/**
	 * Unmark the data store as a backup data store and tell :Get() and reset values to nil.
	 */
	ClearBackup(): void;

	/**
	 * Whether or not the data store is a backup data store and thus won't save during :Save() or call :AfterSave().
	 */
	IsBackup(): boolean;

	/**
	 * Saves the data to the data store. Called when a player leaves.
	 */
	Save(): void;

	/**
	 * Add a function to be called before the game closes. Fired with the player and value of the data store.
	 * @param callback The callback function.
	 */
	BindToClose(callback: (player: Player, value: T) => void): void;
}

interface module {
	/**
	 * This is what the module returns when you require it. You usually use this on PlayerAdded.
	 * Note that the data store name will not be what the name of the data store (because of how the saving method works).
	 */
	<T>(dataStoreName: string, player: Player): DataStore2<T>;

	/**
	 * Run this once to combine all keys provided into one "main key".
	 * Internally, this means that data will be stored in a table with the key mainKey.
	 * This is used to get around the 2-DataStore2 reliability caveat.
	 * @param mainKey The key that will be used to house the table.
	 * @param otherKeys All the keys to combine under one table.
	 */
	Combine: (mainKey: string, ...otherKeys: Array<string>) => void;
}

declare const module: module;
export = module;
