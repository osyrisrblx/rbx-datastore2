# Contributing

## Versioning
The `package.json` file version refers to the current DataStore2 version the package was updated to.

## Testing

The following code can be used to test if your contribution will work. Please note that you will have to use the command `npm pack`

```ts
import * as DataStore2 from "./path.to.your.file";
import { Players } from "@rbxts/services";

DataStore2.Combine('main', 'test', 'test2')
DataStore2.ClearCache()
DataStore2.PatchGlobalSettings({
	SavingMethod: 'OrderedBackups'
})

Players.PlayerAdded.Connect(async player => {
	const DataStore = DataStore2('test', player)
	
	DataStore.Get(0)
	DataStore.Set(0);
	DataStore.Save();
	DataStore.Update(oldValue => {
		if (!typeIs(oldValue, 'number')) {
			return 1;
		}

		return oldValue + 1
	});
	/* Cannot test this because you cannot have a `Get` call AND a `GetAsync` call AND a `GetTable` AND a `GetTableAsync`. TEST FOUR TIMES, once with each method.
	DataStore.GetTable({
		coins: 500
	})
	*/
	DataStore.Increment(20);
	DataStore.OnUpdate(value => {
		print('DataStore updated to ' + value);
	})
	DataStore.SetBackup(5, 'DATASTORES DOWN');
	if (DataStore.IsBackup()) {
		print('Backup DataStore.')
	}
	DataStore.ClearBackup()
	DataStore.BeforeInitialGet(dataValue => {
		print('Before initial get: ' + dataValue)

		return dataValue
	})
	DataStore.BeforeSave(dataValue => {
		print('Before initial save: ' + dataValue)

		return dataValue
	})
	DataStore.AfterSave(value => {
		print('Saved value ' + value);
	})
	/** Cannot test this because you cannot have a `Get` call AND a `GetAsync` call AND a `GetTable` AND a `GetTableAsync`. TEST FOUR TIMES, once with each method.
	DataStore.GetAsync()
		.then(() => {
			print('Got it!');
		})
		.catch((err: unknown) => {
			print('Failed with error ' + err);
		})
	*/
	
	/** Cannot test this because you cannot have a `Get` call AND a `GetAsync` call AND a `GetTable` AND a `GetTableAsync`. TEST FOUR TIMES, once with each method.
	DataStore.GetTableAsync({ coins: 500 })
		.then(data => {
			print('Retrieved with data: ' + data)
		})
	*/
	
	DataStore.IncrementAsync(5)
		.then(() => print('Saved!'));

	DataStore2.SaveAll(player);
})
```
