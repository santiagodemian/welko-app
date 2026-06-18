// Minimal Google Maps Places API type stubs for the address autocomplete in
// app/dashboard/sucursales/page.tsx — avoids installing the full @types/google.maps package.

declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          input: HTMLInputElement,
          opts?: AutocompleteOptions
        )
        getPlace(): PlaceResult
        addListener(event: string, handler: () => void): void
      }

      interface AutocompleteOptions {
        types?: string[]
        componentRestrictions?: { country: string | string[] }
        fields?: string[]
      }

      interface PlaceResult {
        formatted_address?: string
        geometry?: {
          location?: {
            lat(): number
            lng(): number
          }
        }
      }
    }
  }
}
