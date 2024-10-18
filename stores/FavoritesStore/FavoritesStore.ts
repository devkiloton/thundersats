import { makeObservable, observable, runInAction } from "mobx";
import { firebaseClient, Place } from "../../clients/firebase";

export class FavoritesStore {
  @observable favorites: {
    places: Place[];
    loading: boolean;
    loaded: boolean;
  } = {
    places: [],
    loading: false,
    loaded: false,
  };

  constructor() {
    makeObservable(this);
  }

  async create(place: Place) {
    firebaseClient()
      .favorites.create(place)
      .then(() => this.get(true));
    runInAction(() => {
      this.favorites.places.push(place);
    });
  }

  async delete(place: Place) {
    firebaseClient().favorites.delete(place);
    runInAction(() => {
      this.favorites.places = this.favorites.places.filter(
        (favoritePlace) =>
          favoritePlace.locationIdGoogle !== place.locationIdGoogle
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
