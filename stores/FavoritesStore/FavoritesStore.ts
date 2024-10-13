import { makeObservable, observable, runInAction } from "mobx";
import { firebaseClient, Place } from "../../clients/firebase";

export class FavoritesStore {
  @observable favorites: {
    places: (Place & { id: string })[];
    ids: string[];
    loading: boolean;
    loaded: boolean;
  } = {
    places: [],
    ids: [],
    loading: false,
    loaded: false,
  };

  constructor() {
    makeObservable(this);
  }

  async create(placeId: string) {
    firebaseClient()
      .favorites.create(placeId)
      .then(() => this.get(true));
    runInAction(() => {
      this.favorites.ids.push(placeId);
    });
  }

  async delete(placeId: string) {
    firebaseClient().favorites.delete(placeId);
    runInAction(() => {
      this.favorites.ids = this.favorites.ids.filter((id) => id !== placeId);
      this.favorites.places = this.favorites.places.filter(
        (place) => place.id !== placeId
      );
    });
  }

  async get(forceUpdate: boolean = false) {
    if (this.favorites.loaded && !forceUpdate) {
      return this.favorites.places;
    }
    runInAction(() => {
      this.favorites.loading = true;
    });

    firebaseClient()
      .favorites.get()
      .then((favorites) => {
        runInAction(() => {
          this.favorites.places = Object.entries(favorites).map(
            ([id, place]) => ({
              ...place,
              id,
            })
          );
          this.favorites.ids = Object.keys(favorites);
          this.favorites.loaded = true;
          this.favorites.loading = false;
        });
        return this.favorites.places;
      })
      .catch(() => {
        runInAction(() => {
          this.favorites.loading = false;
        });
      });
    return this.favorites.places;
  }
}
