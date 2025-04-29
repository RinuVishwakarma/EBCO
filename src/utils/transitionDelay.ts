const maxDuration = 1; // You can adjust this value as needed

      const getTransition= (index: number , delay :number = 0.1) =>{
        let duration = 0.5 + index * delay;
        // Limit the duration to the maximum
        if (duration > maxDuration) {
          duration = maxDuration;
        }
        return duration;
      }

      export default getTransition;